# Custom Component Starter Kit
1. `git clone git@github.com:BlueBiteLLC/studio-component-template.git`
2. `cd studio-component-template && yarn install`
3. Create a copy of `starter-kit` in the `components` directory, for example `cp -r starter-kit components/my-custom-component`.
4. Run `uuidgen | tr "[A-Z]" "[a-z]"` to create a new uuid and paste it into the `uuid` field of your config.json file (i.e. components/my-custom-component/config.json).
5. `yarn start <your component name>`, i.e. `yarn start my-custom-component`

Note that currently you can only run one custom component locally at a time. This is because each custom component exists as a different webpack configuration, and the start script only points at one of those configurations at a time.

Yes, you can `yarn install` third party modules and use them in your components.

Yes, you can bundle css, images, and other assets with your component.

## Developing Locally
The best development experience for your custom component is to run it in tandem with the studio-renderer. When running both of these projects locally, the renderer dev server will proxy the custom component dev server so that it can load within the context of an experience. Hot module reloading works, as do the studio react hooks and macro evaluator. The hardest part is setting up a localhost studio file to render your custom component, but this repo contains 2 templates that are designed to make this easier.

### Studio File Render Templates
The default way that studio-renderer works on localhost is by modifying the contents of the file located at `studio-renderer/packages/root/dev/v3_experience_file.json`. This file acts as the studio file when running the renderer locally. Hot module reloading works when changing the contents of this file; there is no reason to restart the renderer server after saving changes.

This repo contains 2 templates that can be modified and used as a localhost renderer studio file.
1. A [basic studio file](dev/example-studio-files/component-without-children.json) containing a custom component that has no children.
2. A [basic studio file](dev/example-studio-files/component-with-children.json) containing a custom component that has children. For this template, the children used in the studio file is a stock studio image component.

#### Component Without Children
The starter-kit custom component is designed to work well with the "without-children" template. To get up and running quickly after cloning the starter kit folder, simply copy the contents of the "without-children" template over to the renderer localhost studio file and replace the default zeroed uuid with the uuid of your custom component. Once you have started your custom component dev server (`yarn start my-custom-component`) and the studio renderer, visiting the renderer localhost URL should render your custom component with hot module reload working.

#### Component With Children
If you want your custom component to work as a container within which other components can be nested, make the following changes after creating a copy of the starter kit:
1. Add the property `"hasChildren": true` to your component's config.json file.
2. Modify the root function in your component.js file to accept a `props` argument, and between the nodes where you want the nested contents to be rendered, use the code `{props.renderChildren()}`.
3. Copy the contents of the "with-children" studio file template over to the renderer localhost studio file and replace the default zeroed uuid with the uuid of your custom component.

### Working locally with studio-editor
Sometimes you may want to use the studio-editor to generate more complex studio files including your custom component which you can then copy over to the renderer studio file. This is possible, though there is potentially some additional setup required depending on whether or not your localhost editor is talking to localhost studio-api, or the AWS-hosted dev environment's studio-api.

#### When studio-editor is talking to AWS-hosted dev environment studio-api
This is the default configuration when running studio-editor locally. In order for your custom component to work in this scenario, the dev api database must contain data for your custom component's uuid. You can use Rapid API to create a new uuid for your component in the dev environment.
1. In the Rapid API studio project, use the "Login" route to generate a new access token.
    - Select "dev" for the environment
    - Select your name for "Engineer", and use the "Manage" link to enter your dev studio login password
    - Invoke the Login endpoint (POST /api/login) and ensure that there is a 200 OK response.
2. In the same Rapid API project, use the "Custom Components/Create UUID" endpoint to generate a new uuid.
    - Use the Body tab to give your component a `name`, and optionally a `category` and `description`.
    - Invoke the endpoint (POST /api/components) and ensure that there is a 201 Created response including a newly-generated uuid.
3. Copy the uuid from the API response and paste it into your component's config.json file, replacing any uuid you previously generated.
4. Publish version 1.0.0 of your component to the dev envirionment.
    - Ensure your custom component's config.json file has a `"displayName"` property and value.
    - In the studio-component-template repo root, run `yarn build`.
    - Use the Finder to navigate to `studio-component-template/dist/my-custom-component` (or whichever folder you have for your custom component).
    - Select all files in this folder, right click, and choose "Compress" to create an "Archive.zip" file in that location.
    - In Rapid API, locate the "Custom Components/Upload Version AWS" endpoint and update its path with your component uuid and a version (i.e. POST /api/components/&lt;your new component uuid created above&gt;/1.0.0).
    - In the File tab, choose the Archive.zip file you created above, and invoke the endpoint.
    - Ensure you receive a 201 Created response, and verify your component has been published by invoking the "Custom Components/Get Custom Component" Rapid API endpoint (i.e. GET /api/components/&lt;your new component uuid created above&gt;).
5. If your localhost custom component dev server is running, stop and restart it.
6. With studio-editor running and navigated to edit an experience, open the browser dev tools so that you can type a manual console entry.
7. Use the code `window.addComponent('<my api-generated component uuid>')` from the browser dev tools console to add the custom component to the experience.
8. Continue editing the experience to add any other components you like, and save changes.

With the above steps completed, you can then reload the experience in the browser and use the "Network" tab of the dev tools to locate the experience file data that was loaded. The network request should match the uuid of the experience being edited. Copy the `content` section of that response payload and paste it into your localhost renderer studio file as you would one of the templates. The only change you need to make is to locate the `customComponentVersions` section of the studio file (nested under `relationships`) and change the version from `"1.0.0"` to `"latest"`. This change is necessary because although the AWS-hosted custom components are served from a version-specific path segment, localhost custom components are always served from the "latest" version path segment.

Note that steps 1-5 above need to be executed once in order to set up an initial version of your custom component in the dev environment, and again each time your config.json file's contents change (for example, to add a new option). **Pro Tip**: If you want to run both the editor and renderer locally, you can start the studio-renderer using the command `HOST_PORT=8081 yarn start`, then access it at http://localhost:8081 while you access the studio-editor at http://localhost:8080.

#### When studio-editor is talking to localhost studio-api
It is also possible to run the studio-api/packages/studio_editor_api project locally using docker, and to connect to it from studio-editor running locally by changing the value of env/local/config.json `"API_BASE"` to `"http://localhost:3000/api"`. When you are operating studio-editor locally in this fashion, there is no need to create a custom uuid or to publish a first version of it to the database. In fact if you quit the studio-api docker, restart it and reseed the database, any custom component uuid will "just work" without having to make any database changes at all. Simply follow steps 6-8 above, skipping the first 5 steps, to generate and copy new studio files for use in the renderer.

## Passing props
You can make any number of configurable options for your component which will then automatically be passed as via `props.options.<optionName>` when your component renders. [See confluence for a table of currently supported option types](https://bluebite.atlassian.net/wiki/spaces/ES/pages/2993291270/Custom+Components#Custom-Component-Option-Types). For example, you could add a custom text prop to the starter kit as follows:
1. In your component's config.json file, add a new field named `options` with the following contents:
```
  "options": [
    {
      "type": "field",
      "name": "greetingTarget",
      "label": "Who will the component greet?",
      "defaultValue": "World"
    }
  ]
``` 
2. In the renderer studio file, add the prop to the `userDefinedOptions` section like so:
```
  "userDefinedOptions": {
    "greetingTarget": "World"
  },
```
3. In your custom component, retrieve and render the prop value wherever you like. For example:
```
const CustomComponentRoot = (props) => (
    <>
        Hello, {props.options.greetingTarget}!
    </>
);

```

### Using Macros in props
Some option types also support macros, but they are disabled by default. To enable macros on an option, set `"enableMacros": true` for the relevant option(s) in your config.json file. For example:
1. In config.json:
```
  "options": [
    {
      "enableMacros": true
      "type": "field",
      "name": "greetingTarget",
      "label": "Who will the component greet?",
      "defaultValue": "World"
    }
  ]
``` 
2. In the renderer studio file:
```
  "userDefinedOptions": {
    "greetingTarget": "{{ \"World\" }}"
  },
```
You can change the contents of the localhost studio-renderer interaction data by modifying the contents of the file located at `studio-renderer/packages/root/dev/v3_sdk_data.json`. For example, the following works on localhost:
1. In the renderer studio file:
```
  "userDefinedOptions": {
    "greetingTarget": "{{ tag:variable:greetingTarget }}"
  },
```
2. In the renderer SDK data file:
```
{
  "object": {
    ...
    "variables": {
      "greetingTarget": "World"
    },
    ...
  },
  ...
}
```

#### Advanced Macro Options
Macros may produce errors when experience authors do not enter them correctly. The default behavior of the studio-renderer is to **omit rendering** a custom component every time its props contain one or more macro errors. Additionally, the default behavior of the renderer is to **omit rendering** a custom component while macro evaluation is still in progress, before success or failure is known.

These two behaviors can be overridden by custom component authors so that rendering still takes place while macros are still being evaluated, when any one of them has an error, or both. When either of these behaviors is enabled, the custom component will receive a second prop named `optionStatus` that contains the status of the macro evaluation for each macro-enabled option along with a corresponding message. The possible values for status are `'Unresolved' | 'Resolved' | 'Error'`.

Example:
```
const CustomComponentRoot = (props) => {
    let message = `Hello, ${props.options.greetingTarget}!`;
    const greetingStatus = props.optionStatus.greetingTarget.status;
    if (greetingStatus === 'Unresolved') {
        message = 'Loading...';
    } else if (greetingStatus === 'Error') {
        message = props.optionStatus.greetingTarget.message;
    }
    return (
        <>
            {message}
        </>
    );
};

CustomComponentRoot.renderWhenMacroError = true;
CustomComponentRoot.renderWhenMacroUnresolved = true;

export default CustomComponentRoot;
```

## Using Studio React Hooks
There are [three custom react hooks](https://bluebite.atlassian.net/l/cp/0g2FhvSw) located in the `bbstudio/hooks` module that give you read/write access to local variables, read/write access to object variables, and read access to interaction data.
- `useLocalVariables`: Use for read access to all studio local variables.
- `useLocalVariable`: Use for read & write access to a single studio local variable.
- `useInteraction`: Use for read access to all interaction data plus write access to object variables.

For more information about these hooks, [see the confluence documentation](https://bluebite.atlassian.net/l/cp/0g2FhvSw) and [the sdk-hooks-example component](components/sdk-hooks-example/component.jsx).

## Component Files
### config.json
The config.json file defines the contract between your custom component and the studio platform. The most important entry is the `uuid` field which identifies your component within a given hosting environment. To get started developing a new component on localhost, you can copy this starter-kit into the components directory, generate a new uuid, and paste it in the appropriate place in your new component's config.json file. When it comes time to publish your component, you will have to use the API to generate a uuid for that field. [Learn more about the publishing process](link/to/publishing/docs).

#### config.json schema
Properties with a question mark `?` are optional, all others are required.
- `uuid`: This identifies the custom component; each one should have a different uuid.
- `displayName`: Legacy method of giving the component a human-readable name. **This will be deprecated in favor of API-based naming once the API is completed**.
- `editorIcon?`: Legacy method of giving the component a custom icon for display in the studio editor. **This will be deprecated in favor of API-based icons (using the asset service) once the API is completed**.
- `hasChildren?`: A boolean (`true` or `false`) value that indicates whether or not the component accepts other components as its `children`; in other words, whether or not the component acts as a container to wrap other components. Omitting this property is the same as setting it to false.
- `options`: An array of configurations for setting custom props on the component.
  - `type`: In studio editor, this is the type of input that the experience author will use to configure the prop's value. [Learn more about what option types are supported](https://bluebite.atlassian.net/wiki/spaces/ES/pages/2993291270/Custom+Components#Custom-Component-Option-Types).
  - `name`: The name of the prop as it will be received in the component. These should be formatted using camelCase.
  - `label`: In studio editor, this is how the prop input field will be labeled. These should be set to short, human-reable text.
  - `defaultValue?`: In studio editor, this is what the default value will be for the property input. Omitting it is the same as setting it to an empty string (or false for boolean values like checkbox).
  - `enableMacros?`: A boolean value indicating whether or not the property will accept and evaluate macros. Note that [macros are only supported on a limited set of option types](https://bluebite.atlassian.net/wiki/spaces/ES/pages/2993291270/Custom+Components#Custom-Component-Option-Types). Omitting this property is the same as setting it to false.

### index.js
The index.js file is what connects your custom component to the webpack build, and should look something like this:
```
export { default } from './component';
``` 
...where the file at `./component` has a single default export of your component's main entry function (or class).

### component.js
This file is what will contain the default export to be exposed to webpack via the index.js file. It need not be named `component.js`, but its path and name must match the source as defined in index.js.

