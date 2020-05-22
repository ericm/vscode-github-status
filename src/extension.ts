import * as vscode from "vscode";
import GitHubServce from "./service/github";

const statusBarIcon = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Left
);
statusBarIcon.text = "$(pulse) Sending to GitHub status...";

const config = vscode.workspace.getConfiguration("github-status");

export async function activate(context: vscode.ExtensionContext) {
  const token = config.get<string>("token");
  const gitHubService = new GitHubServce(token);
  if (vscode.workspace.name) {
    gitHubService.updateStatus(vscode.workspace.name);
  }
}

export function deactivate() {}
