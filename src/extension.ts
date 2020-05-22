import * as vscode from "vscode";
import GitHubServce from "./service/github";

const statusBarIcon = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Left
);
statusBarIcon.text = "$(pulse) Sending to GitHub status...";

const config = vscode.workspace.getConfiguration("githubstatus");

export async function activate(context: vscode.ExtensionContext) {
  const token = config.get<string>("token");
  const gitHubService = new GitHubServce(token);
  if (gitHubService.received && vscode.workspace.name) {
    gitHubService.updateStatus(vscode.workspace.name);
  }
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
          await config.update("token", newToken);
          vscode.commands.executeCommand("githubstatus.restart");
        }
      } catch (err) {
        console.error(err);
      }
    }
  );
  let restart = vscode.commands.registerCommand(
    "githubstatus.restart",
    () => {}
  );
  context.subscriptions.push(disposable, accessToken, restart);
}

export function deactivate() {}
