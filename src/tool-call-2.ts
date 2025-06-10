export default async function toolCall2(paramOne: string, envVar: string): Promise<string> {
    let result = '';

    console.log(`Received event with the following parameters: ${paramOne}, and the following env var: ${envVar}.`)

    result = paramOne + 'BAR';

    return result;
}
