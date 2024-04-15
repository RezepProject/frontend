## Clean Code Ruleset

Developers are expected to adhere to the following rules to maintain clean and organized codebase:

1. **Folder Structure:** Organize the code into a tidy folder system that logically groups related files. For example, separate folders for components, utilities, styles, and assets.

2. **Util Classes:** Extract common functionality into utility classes. Follow the example of existing Util classes like QuestionHandler or TokenUtil. Utilize these classes for random functions scattered throughout the codebase to ensure better organization and reusability.

3. **Gitignore:** Implement a valid .gitignore file that excludes IDE-related files, generated JavaScript files, and the node_modules directory. This helps keep the repository clean and prevents unnecessary files, particularly large dependencies, from being committed.

4. **Naming Conventions:** Variables, functions, classes, and other elements should use speaking names that accurately describe their purpose. Follow the official JavaScript naming conventions for consistency and readability.

5. **Modularization:** Break down large components or functions into smaller, more manageable modules. This improves code maintainability and makes it easier to understand and debug.

6. **Remove Dead Code:** Eliminate unused variables, functions, or imports to reduce clutter and improve code clarity.

7. **Design Patterns:** If a relevant design pattern exists for the code being developed, it should be utilized. For instance, when developing an application with a database, frontend, and controllers, adhere to the MVC pattern or other appropriate patterns instead of having loose code around.
