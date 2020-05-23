import * as vscode from "vscode";
import GitHubServce from "./service/github";

const statusBarIcon = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Left
);
statusBarIcon.text = "$(pulse) Sending to GitHub status...";

let config = vscode.workspace.getConfiguration("githubstatus");
let interval: NodeJS.Timeout | null = null;

export async function activate(context: vscode.ExtensionContext) {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders[0].uri.fsPath in config.get<string[]>("blacklist")!) {
    return;
  }
  statusBarIcon.show();
  const token = config.get<string>("token");
  const gitHubService = new GitHubServce(token);
  if (gitHubService.received && vscode.workspace.name) {
    interval = await gitHubService.updateStatus(vscode.workspace.name);
  }
  statusBarIcon.text = "GitHub Status Syncing";
  statusBarIcon.command = "githubstatus.deactivate";
  try {
    let disposable = vscode.commands.registerCommand(
      "githubstatus.createToken",
      async () => {
        try {
          const info = await vscode.window.showInformationMessage(
            "This extension requires a GitHub token with ther [user] permission. To create a token, click the button",
            { modal: true },
            "Create Token"
          );
          if (info) {
            // Create token
            await vscode.env.openExternal(
              vscode.Uri.parse("https://github.com/settings/tokens")
            );
            vscode.commands.executeCommand("githubstatus.accessToken");
          }
          console.log(info);
        } catch (err) {
          console.error(err);
        }
      }
    );
    let accessToken = vscode.commands.registerCommand(
      "githubstatus.accessToken",
      async () => {
        try {
          const newToken = await vscode.window.showInputBox({
            prompt: "Enter the github access token here",
          });
          if (!newToken) {
            vscode.commands.executeCommand("githubstatus.accessToken");
          } else {
            await config.update("token", newToken, 1);
            vscode.commands.executeCommand("githubstatus.restart");
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
    let restart = vscode.commands.registerCommand(
      "githubstatus.restart",
      () => {
        console.log("Restart");
        config = vscode.workspace.getConfiguration("githubstatus");
        activate(context);
      }
    );
    let deac = vscode.commands.registerCommand(
      "githubstatus.deactivate",
      () => {
        console.log("Deactivating");
        deactivate();
      }
    );
    context.subscriptions.push(disposable, accessToken, restart, deac);
  } catch {
    console.log("Restarted");
  }
}

export function deactivate() {
  statusBarIcon.text = "GitHub Status Not Syncing";
  statusBarIcon.command = "githubstatus.restart";
  if (interval) {
    clearInterval(interval);
  }
}
