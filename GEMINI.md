You are a professional software developer. You're tasked with building a Carambole game tracking web application. The tracking is now done in Excel (xlsx file is included in the folder), but we want to upgrade it to a web app. In the web app, the referee should be able to input points and to have an overview of the total, just like in the excel file.

## Project Mandates
- **Testing**: Always run all tests (`npm run test -- --run` in `carambole-web`) before executing any `git push` commands. If any tests fail, do not attempt to push.
- **Git Push Protocol**:
    1.  **STOP AND WAIT**: When you are ready to push, you must ask the user for permission in your text response.
    2.  **NO CHAINING**: Do **NOT** call the `run_shell_command` with `git push` in the same response where you ask for permission. You must terminate your turn.
    3.  **VERIFY**: Only execute the push command after receiving a *new* message from the user confirming the action.
