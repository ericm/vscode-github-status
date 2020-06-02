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

  public async updateStatus(workspace: string): Promise<NodeJS.Timeout | null> {
    const emoji = vscode.workspace
      .getConfiguration("githubstatus")
      .get("emoji") as Emoji;
    const time = moment(new Date());
    let diff = "";
    let interval: NodeJS.Timeout | null = null;
    if (!this.__start) {
      this.__start = time;
      interval = setInterval(
        () => this.updateStatus(workspace),
        this.__expires * 60000
      );
    } else {
      let diffN = Math.floor(time.diff(this.__start, "minutes"));
      diff = `(${diffN} minute${diffN > 1 ? "s" : ""})`;
      if (diffN > 60) {
        const hours = Math.floor(diffN / 60);
        const minutes = Math.floor(diffN % 60);
        console.log(diffN, time.diff(this.__start, "minutes"), hours, minutes);
        diff = `(${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
          minutes > 1 ? "s" : ""
        })`;
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
      return interval;
    }
  }
  public async setDefault(): Promise<void> {
    const message = vscode.workspace
      .getConfiguration("githubstatus")
      .get("default") as string;
    if (!message) {
      return;
    }
    const emoji = vscode.workspace
      .getConfiguration("githubstatus")
      .get("emojiDefault") as Emoji;
    const status: UserStatus = {
      emoji,
      message,
    };
    try {
      await this.__api(changeUserStatusMutation, { request: {}, status });
    } catch (err) {
      console.error(err);
    }
  }
}
