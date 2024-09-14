
---

###  **`login`** 

To access commands that require user authentication, you need to log in to your GitHub account using a Personal Access Token (PAT). Here's how you can do it:

#### Step 1: Generate a Personal Access Token (PAT)

1. Log in to your GitHub account and go to [**Settings**](https://github.com/settings/).
2. In the sidebar, click on [**Developer settings**](https://github.com/settings/apps).
3. Click on **Personal access tokens** and then select [**Tokens (classic)**](https://github.com/settings/tokens).
4. Click the **Generate new token** button.
5. Give your token a descriptive name and select the necessary scopes for your CLI tool (such as `repo`, `read:org`, and `user`).
6. Scroll down and click **Generate token**.
7. Copy the generated token.

:::warning

**Important:** Avoid selecting unnecessary scopes to prevent unauthorized access to your GitHub account.

:::

:::info

**Note:** You can always revoke a token if you suspect it has been compromised.

:::

#### Step 2: Authenticate with the Personal Access Token

Once you have your token, run the following command to authenticate with `ghc`:


```bash
ghc login
```

The CLI will prompt you to enter your PAT. Paste the token you generated in Step 1.
:::info

**Note:** While pasting the token on the terminal, right-click on the terminal.

:::

Once authenticated, you will be able to access all the commands that require login.

 ![ghc login](/gifs/login.gif)


###  **`logout`** 

To log out of your GitHub account, run the following command:

```bash
ghc logout
```

:::info

This will remove the stored token and log you out of your GitHub account.

:::

 ![ghc logout](/gifs/logout.gif)

--- 

## Commands That **Require Login** 🔐

These commands perform actions that modify data or require access to private repositories, so user authentication is necessary:

### Repository Management

- [`repo-list`](/cli-gh/docs/commands/Repository/#repo-list) – List public repositories for a user
- [`repo-create`](/cli-gh/docs/commands/Repository/#repo-create) – Create a new GitHub repository
- [`repo-update`](/cli-gh/docs/commands/Repository/#repo-update) – Update a GitHub repository
- [`repo-delete`](/cli-gh/docs/commands/Repository/#repo-delete) – Delete a GitHub repository
- [`repo-star`](/cli-gh/docs/commands/Repository/#repo-star) – Star a GitHub repository
- [`repo-unstar`](/cli-gh/docs/commands/Repository/#repo-unstar) – Unstar a GitHub repository
- [`repo-fork`](/cli-gh/docs/commands/Repository/#repo-fork) – Fork a GitHub repository
- [`repo-traffic`](/cli-gh/docs/commands/Repository/#repo-traffic) – Get traffic statistics for a GitHub repository

### Pull Request Management

- `pr-create` – Create a new pull request
- `pr-merge` – Merge a pull request

### Branch Management

- `branch-create` – Create a new branch
- `branch-delete` – Delete a branch

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

:::warning

**Note:** If api rate limit is exceeded, you will be prompted to [login](/cli-gh/docs/commands/Authentication/#login) to access the data.

:::

### Repository Information

- `repo-clone` – Clone a GitHub repository
- `repo-info` – Get detailed information about a repository
- `repo-actions` – List GitHub Actions for a repository

### Issue Information

- `issue-list` – List issues in a repository
- `issue-info` – Get detailed information about an issue

### Pull Request Information

- `pr-list` – List pull requests for a repository
- `pr-info` – Get details about a pull request

### Branch Information

- `branch-list` – List all branches in a repository

### Collaborator Information

- `collaborator-list` – List collaborators for a repository

### User Information

- `user-info` – Get information about a GitHub user

---
