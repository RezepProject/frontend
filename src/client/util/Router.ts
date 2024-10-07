export class Router {
    private routes: { [path: string]: () => void } = {};
    private currentPath: string = '/';
  
    constructor() {
      window.addEventListener('popstate', (event) => {
        this.navigate(event.state?.path || '/');
      });
    }
  
    public registerRoute(path: string, component: () => void) {
      this.routes[path] = component;
    }
  
    public navigate(path: string) {
      history.pushState({ path }, '', path);
      this.currentPath = path;
      this.render();
    }
  
    private render() {
      const component = this.routes[this.currentPath];
  
      if (component) {
        component();
      } else {
        // Handle 404 or other error
        console.error(`Route not found: ${this.currentPath}`);
      }
    }
  }