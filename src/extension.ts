import * as vscode from "vscode";

const statusBarIcon = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Left
);
statusBarIcon.text = "$(pulse) Sending to GitHub status...";

const config = vscode.workspace.getConfiguration("github-status");

export async function activate(context: vscode.ExtensionContext) {
  const token = config.get<string>("token");
  if (!token) {
    return;
  }
}

export function deactivate() {}
