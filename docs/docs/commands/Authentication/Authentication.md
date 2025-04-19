
---

###  **`login`** 

To access commands that require user authentication, you need to log in to your GitHub account using a Personal Access Token (PAT). Here's how you can do it:

#### Step 1: Generate a Personal Access Token (PAT)

1. Log in to your GitHub account and go to [<u>**Settings**</u>](https://github.com/settings/).
2. In the sidebar, click on [<u>**Developer settings**</u>](https://github.com/settings/apps).
3. Click on **Personal access tokens** and then select [<u>**Tokens (classic)**</u>](https://github.com/settings/tokens).
4. Click the **Generate new token** button.
5. Give your token a descriptive name and select the necessary scopes (such as `repo`, `read:org`, and `user`).
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

- <u>[`repo-list`](/cli-gh/docs/commands/Repository/#repo-list)</u> – List public repositories for a user
- <u>[`repo-create`](/cli-gh/docs/commands/Repository/#repo-create)</u> – Create a new GitHub repository
- <u>[`repo-update`](/cli-gh/docs/commands/Repository/#repo-update)</u> – Update a GitHub repository
- <u>[`repo-delete`](/cli-gh/docs/commands/Repository/#repo-delete)</u> – Delete a GitHub repository
- <u>[`repo-star`](/cli-gh/docs/commands/Repository/#repo-star)</u> – Star a GitHub repository
- <u>[`repo-unstar`](/cli-gh/docs/commands/Repository/#repo-unstar)</u> – Unstar a GitHub repository
- <u>[`repo-fork`](/cli-gh/docs/commands/Repository/#repo-fork)</u> – Fork a GitHub repository
- <u>[`repo-traffic`](/cli-gh/docs/commands/Repository/#repo-traffic)</u> – Get traffic statistics for a GitHub repository

### Pull Request Management

- <u>[`pr-create`](/cli-gh/docs/commands/Pull%20Request/#pr-create)</u> – Create a new pull request
- <u>[`pr-merge`](/cli-gh/docs/commands/Pull%20Request/#pr-merge)</u> – Merge a pull request

### Branch Management

- <u>[`branch-create`](/cli-gh/docs/commands/Branch/#branch-create)</u> – Create a new branch
- <u>[`branch-delete`](/cli-gh/docs/commands/Branch/#branch-delete)</u> – Delete a branch

### Issue Management

- <u>[`issue-create`](/cli-gh/docs/commands/Issue/#issue-create)</u> – Create a new issue for a GitHub repository
- <u>[`issue-update`](/cli-gh/docs/commands/Issue/#issue-update)</u> – Update an existing issue
- <u>[`issue-close`](/cli-gh/docs/commands/Issue/#issue-close)</u> – Close an issue

### Collaborator Management

- <u>[`collaborator-add`](/cli-gh/docs/commands/Collaborator/#collaborator-add)</u> – Add a collaborator to a repository
- <u>[`collaborator-remove`](/cli-gh/docs/commands/Collaborator/#collaborator-remove)</u> – Remove a collaborator from a repository

### User Management

- <u>[`user-update`](/cli-gh/docs/commands/User/#user-update)</u> – Update user information (self)

---

## Commands That **Do Not Require Login** 🔓

These commands are used for fetching data or interacting with public resources, and do not require authentication:

:::warning

**Note:** If the API rate limit is exceeded, you will be prompted to [login](/cli-gh/docs/commands/Authentication/#login) to access the data.

:::

### Repository Information

- <u>[`repo-clone`](/cli-gh/docs/commands/Repository/#repo-clone)</u> – Clone a GitHub repository
- <u>[`repo-info`](/cli-gh/docs/commands/Repository/#repo-info)</u> – Get detailed information about a repository
- <u>[`repo-actions`](/cli-gh/docs/commands/Repository/#repo-actions)</u> – List GitHub Actions for a repository

### Issue Information

- <u>[`issue-list`](/cli-gh/docs/commands/Issue/#issue-list)</u> – List issues in a repository
- [`issue-info`](/cli-gh/docs/commands/Issue/#issue-info) – Get detailed information about an issue

### Pull Request Information

- <u>[`pr-list`](/cli-gh/docs/commands/Pull%20Request/#pr-list)</u> – List pull requests for a repository
- <u>[`pr-info`](/cli-gh/docs/commands/Pull%20Request/#pr-info)</u> – Get details about a pull request

### Branch Information

- <u>[`branch-list`](/cli-gh/docs/commands/Branch/#branch-list)</u> – List all branches in a repository

### Collaborator Information

- <u>[`collaborator-list`](/cli-gh/docs/commands/Collaborator/#collaborator-list)</u> – List collaborators for a repository

### User Information

- <u>[`user-info`](/cli-gh/docs/commands/User/#user-info)</u> – Get information about a GitHub user

---
