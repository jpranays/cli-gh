
---

To use the commands listed below, you must first authenticate using the `ghc login` command by providing a GitHub **Personal Access Token (PAT)**. Here’s how to generate and use a PAT:

#### Step 1: Generate a Personal Access Token (PAT)

1. Log in to your GitHub account and go to [**Settings**](https://github.com/settings/).
2. In the sidebar, click on [**Developer settings**](https://github.com/settings/apps).
3. Click on **Personal access tokens** and then select [**Tokens (classic)**](https://github.com/settings/tokens).
4. Click the **Generate new token** button.
5. Give your token a descriptive name and select the necessary scopes for your CLI tool (such as `repo`, `read:org`, and `user`).
6. Scroll down and click **Generate token**.
7. Copy the generated token.

:::warning

Avoid selecting unnecessary scopes to prevent unauthorized access to your GitHub account.

:::

:::tip

You can always revoke a token if you suspect it has been compromised.

:::

#### Step 2: Authenticate with the Personal Access Token

Once you have your token, run the following command to authenticate with `ghc`:

```bash
ghc login
```

The CLI will prompt you to enter your PAT. Paste the token you generated in Step 1.

Once authenticated, you will be able to access all the commands that require login.

![ghc login](/gifs/login.gif)

--- 

## Commands That **Require Login** 🔐

These commands perform actions that modify data or require access to private repositories, so user authentication is necessary:

### Repository Management

- `repo-create` – Create a new GitHub repository
- `repo-update` – Update a GitHub repository
- `repo-delete` – Delete a GitHub repository
- `repo-star` – Star a GitHub repository
- `repo-unstar` – Unstar a GitHub repository
- `repo-fork` – Fork a GitHub repository
- `repo-traffic` – Get traffic statistics for a GitHub repository

### Pull Request Management

- `pr-create` – Create a new pull request
- `pr-merge` – Merge a pull request

### Branch Management

- `create-branch` – Create a new branch
- `delete-branch` – Delete a branch

### Issue Management

- `issue-create` – Create a new issue for a GitHub repository
- `issue-update` – Update an existing issue
- `issue-close` – Close an issue

### Collaborator Management

- `add-collaborator` – Add a collaborator to a repository
- `remove-collaborator` – Remove a collaborator from a repository

### User Management

- `user-update` – Update user information (self)

-------------------------

## Commands That **Do Not Require Login** 🔓

These commands are used for fetching data or interacting with public resources, and do not require authentication:

### Repository Information

- `repo-list` – List public repositories for a user
- `repo-clone` – Clone a GitHub repository
- `repo-info` – Get detailed information about a repository
- `repo-actions` – List GitHub Actions for a repository

### Issue Information

- `repo-issues` – List issues in a repository
- `issue-info` – Get detailed information about an issue

### Pull Request Information

- `pr-list` – List pull requests for a repository
- `pr-info` – Get details about a pull request

### Branch Information

- `branches` – List all branches in a repository

### Collaborator Information

- `collaborators` – List collaborators for a repository

### User Information

- `user-info` – Get information about a GitHub user

---
