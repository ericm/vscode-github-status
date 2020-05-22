import * as vscode from "vscode";
import { graphql as gitHubApi } from "@octokit/graphql";
import { RequestParameters, graphql } from "@octokit/graphql/dist-types/types";

interface IEnv {
  [key: string]: string | undefined;
}

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
  private __expires: number = 30;
  constructor(token?: string) {
    const config: RequestParameters = {};
    if (token) {
      config.headers = { authorization: `token ${token}` };
    } else {
      // Get token
    }
    this.__api = gitHubApi.defaults(config);
  }

  public async updateStatus(workspace: string) {
    const status: UserStatus = {
      expiresAt: new Date(
        new Date().getTime() + this.__expires * 60000
      ).toISOString(),
      message: `Working on ${workspace}`,
      emoji: ":zap:",
    };
    try {
      await this.__api(changeUserStatusMutation, { request: {}, status });
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => this.updateStatus(workspace), this.__expires * 60000);
  }
}
