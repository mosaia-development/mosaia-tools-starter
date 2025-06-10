import toolCall1 from "./tool-call-1";
import toolCall2 from "./tool-call-2";

type RawEvent = {
    body: string;
}

type ParsedEvent = {
    args: Record<string, any>;
    secrets: Record<string, string>;
}

type ParsedEventMultipleToolCalls = {
    args: {
        function_args: Record<string, string>
    };
    secrets: Record<string, string>;
}

const toolCalls: Record<string, (...args: string[]) => Promise<string>> = {
    func_1: toolCall1,
    func_2: toolCall2,
}

export async function handler(event: RawEvent) {
    const {
        args: {
            function_args: {
                intent,
                func_1_arg_1,
                func_1_arg_2,
                func_2_arg_1,
            }
        },
        secrets: {
            ENV_VAR_ONE
        }
    } = JSON.parse(event.body) as ParsedEventMultipleToolCalls;

    try {
        let toolCall = toolCalls[intent];
        let result;
        if (intent === 'func_1') {
            result = await toolCall(func_1_arg_1, func_1_arg_2, ENV_VAR_ONE)
        } else if (intent === 'func_2') {
            result = await toolCall(func_2_arg_1, ENV_VAR_ONE)
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    } catch (error: unknown) {
        let message = '';

        if (error instanceof Error) {
            message = error.message;
        } else {
            message = 'Unknown error';
        }

        return {
            statusCode: 500,
            body: JSON.stringify(message),
        };
    }
}
