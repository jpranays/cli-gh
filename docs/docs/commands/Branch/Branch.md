
---

- ### **`branch-create`**

  Creates a new branch in a GitHub repository.
  
  ```bash
  ghc branch-create
  ```

  This command will prompt you to enter the name of the new branch and the source branch from which the new branch will be created.

  ![ghc branch-create](/gifs/branch-create.gif)


- ### **`branch-delete`**

  Deletes an existing branch in a GitHub repository.
  
  ```bash
  ghc branch-delete
  ```

  Use this command to delete a branch from the repository. It requires the necessary permissions for branch deletion.

  :::danger
  
  **Warning:** Deleting a branch is irreversible. Make sure you’ve merged or backed up any necessary changes.

  :::

  ![ghc branch-delete](/gifs/branch-delete.gif)

---

- ### **`branch-list`**

  Lists all branches in a GitHub repository.
  
  ```bash
  ghc branch-list
  ```

  This command lists all branches in the specified repository, including the default branch and any feature or development branches.

  ![ghc branch-list](/gifs/branch-list.gif)

---