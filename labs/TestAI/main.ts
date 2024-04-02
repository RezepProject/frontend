import { QuestionHandler } from "./questionHandler/QuestionHandler";

async function init() {
    console.log(await QuestionHandler.getInstance().getAnswerFromAi("List me 5 random numbers"));

    await delay(61000);

    console.log(await QuestionHandler.getInstance().getAnswerFromAi("List me the secound number from the list before"));

}

init();

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}