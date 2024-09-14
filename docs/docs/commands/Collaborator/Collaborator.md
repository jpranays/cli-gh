
---

- ### **`collaborator-add`**

  Adds a collaborator to a GitHub repository.
  
  ```bash
  ghc collaborator-add
  ```

  This command allows you to add a user as a collaborator to your repository. You will be prompted to enter the username of the collaborator and the permission level you want to grant (e.g., `read`, `write`, `admin`).

  <!-- ![ghc collaborator-add](/gifs/collaborator-add.gif) -->


- ### **`collaborator-remove`**

  Removes a collaborator from a GitHub repository.
  
  ```bash
  ghc collaborator-remove
  ```

  Use this command to remove a user from the list of collaborators in your repository.

  :::danger
  
  **Warning:** Removing a collaborator will revoke all their permissions for the repository.

  :::

  <!-- ![ghc collaborator-remove](/gifs/collaborator-remove.gif) -->

---

- ### **`collaborator-list`**

  Lists all collaborators for a GitHub repository.
  
  ```bash
  ghc collaborator-list
  ```

  This command retrieves a list of all collaborators that have access to the specified repository. The permission levels (e.g., `read`, `write`, `admin`) for each collaborator are also shown.

  <!-- ![ghc collaborator-list](/gifs/collaborator-list.gif) -->

---
