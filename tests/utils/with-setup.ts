
import { createApp } from "vue";

export const withSetup = (composables: () => any) =>{
let result: any;

const app = createApp({
    setup() {
        result = composables();

        return () => {}
    }
})

app.mount(document.createElement('div'));

return [result, app] as const;
}