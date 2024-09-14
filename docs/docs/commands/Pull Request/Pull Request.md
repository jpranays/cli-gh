
---

- ### **`pr-create`**

  Creates a new pull request for a GitHub repository.
  
  ```bash
  ghc pr-create
  ```

  This command will prompt you to enter the necessary details (such as branch, title, description, etc) to create a new pull request in a GitHub repository.

  ![ghc pr-create](/gifs/pr-create.gif)


- ### **`pr-merge`**

  Merges an existing pull request into the target branch.
  
  ```bash
  ghc pr-merge
  ```

  Use this command to merge a pull request into the repository’s target branch (e.g., `main` or `master`). It requires the necessary write permissions for the repository.

  :::danger
  
  **Warning:** Merging a pull request is irreversible, ensure proper review and testing before merging.

  :::

  ![ghc pr-merge](/gifs/pr-merge.gif)

---

- ### **`pr-list`**

  Lists all open pull requests in a GitHub repository.
  
  ```bash
  ghc pr-list
  ```

  This command retrieves a list of open pull requests for the specified repository.

  ![ghc pr-list](/gifs/pr-list.gif)


- ### **`pr-info`**

  Gets detailed information about a specific pull request.
  
  ```bash
  ghc pr-info
  ```

  Use this command to fetch details such as title, description, status, and reviews for a particular pull request.

  ![ghc pr-info](/gifs/pr-info.gif)

---