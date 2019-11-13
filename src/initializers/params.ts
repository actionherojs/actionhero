import { api, Initializer } from "../index";

/**
 * Collects and formats allowed params for this server.
 */
export class Params extends Initializer {
  constructor() {
    super();
    this.name = "params";
    this.loadPriority = 420;
  }

  async initialize() {
    api.params = {
      postVariables: []
    };

    // special params we will always accept
    api.params.globalSafeParams = [
      "file",
      "apiVersion",
      "callback",
      "action",
      "messageId"
    ];

    api.params.buildPostVariables = () => {
      const postVariables = [];
      let i;
      let j;

      api.params.globalSafeParams.forEach(p => {
        postVariables.push(p);
      });

      for (i in api.actions.actions) {
        for (j in api.actions.actions[i]) {
          const action = api.actions.actions[i][j];
          for (const key in action.inputs) {
            postVariables.push(key);
          }
        }
      }

      api.params.postVariables = api.utils.arrayUniqueify(postVariables);
      return api.params.postVariables;
    };

    api.params.buildPostVariables();
  }
}
