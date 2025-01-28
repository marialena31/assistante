// e:/Projets/AssistantPortfolio/types/vanilla-jsoneditor.d.ts
declare module 'vanilla-jsoneditor' {
    interface JSONEditor {
        updateProps: (props: any) => void; // Adjust the parameter type as needed
    }
    
    export class JSONEditor {
        constructor(options: {
            target: HTMLElement;
            props: {
                content: {
                    json: any;
                };
                onChange: (updatedContent: any) => void;
            };
        });
        // Add more methods and properties as needed
    }
}