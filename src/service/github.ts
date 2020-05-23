import * as vscode from "vscode";
import { graphql as gitHubApi } from "@octokit/graphql";
import { RequestParameters, graphql } from "@octokit/graphql/dist-types/types";
import * as moment from "moment";

interface IEnv {
  [key: string]: string | undefined;
}

const OFFSET = 10000;

const changeUserStatusMutation = `
  mutation ($status: ChangeUserStatusInput!) {
    changeUserStatus(input: $status) {
      status {
        emoji
        expiresAt
        limitedAvailability: indicatesLimitedAvailability
        message
      }
    }
  }
`;

export default class {
  private __api: graphql;
  private __expires = 1;
  private __start?: moment.Moment;
  public received = false;
  constructor(token?: string) {
    const config: RequestParameters = {};

    this.__expires =
      vscode.workspace.getConfiguration("githubstatus").get("interval") ?? 1;

    if (token) {
      this.received = true;
      config.headers = { authorization: `token ${token}` };
    } else {
      // Get token
      vscode.commands.executeCommand("githubstatus.createToken");
    }
    this.__api = gitHubApi.defaults(config);
  }

  public async updateStatus(workspace: string) {
    const emoji = vscode.workspace
      .getConfiguration("githubstatus")
      .get("emoji") as Emoji;
    const time = moment(new Date());
    let diff = "";
    if (!this.__start) {
      this.__start = time;
    } else {
      let diffN = time.diff(this.__start, "minutes");
      diff = `(${diffN} minute${diffN > 1 ? "s" : ""})`;
      if (diffN > 60) {
        let diffNStr = time.diff(this.__start, "hours", true).toFixed(2);
        diff = `(${diffNStr} hours)`;
      }
    }
    const status: UserStatus = {
      expiresAt: new Date(
        OFFSET + new Date().getTime() + this.__expires * 60000
      ).toISOString(),
      message: `Working on ${workspace} ${diff}`,
      emoji,
    };
    try {
      await this.__api(changeUserStatusMutation, { request: {}, status });
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => this.updateStatus(workspace), this.__expires * 60000);
    }
  }
}
