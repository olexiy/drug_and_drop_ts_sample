/* eslint-disable no-restricted-syntax */
/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */
/// <reference path="models/drag-and-drop.ts"/>
/// <reference path="models/project.ts"/>
/// <reference path="project-state.ts"/>
/// <reference path="decorators/autobind.ts"/>
/// <reference path="util/validation.ts"/>

namespace App{

// Component Base Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLElement;
    element: HTMLElement;

    constructor(templateId: string,
      hostElementId: string,
      insertAtStart:boolean,
      newElementId?: string) {
      this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
      this.hostElement = document.getElementById(hostElementId) as T;

      const importedNode = document.importNode(this.templateElement.content, true);
      this.element = importedNode.firstElementChild as U;
      if (newElementId) {
        this.element.id = newElementId;
      }

      this.attach(insertAtStart);
    }

    private attach(insertAtStart: boolean) {
      this.hostElement.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend', this.element);
    }

    abstract configure(): void;
    abstract renderContent(): void;
}

// Project Item Class
class ProjectItem extends Component<HTMLUListElement, HTMLElement> implements Draggable {
    private project: Project;

    get persons() {
      if (this.project.people === 1) {
        return '1 person';
      }
      return `${this.project.people} persons`;
    }

    constructor(hostId: string, project: Project) {
      super('single-project', hostId, false, project.id);
      this.project = project;

      this.configure();
      this.renderContent();
    }
    @autobind
    dragStartHandler(event: DragEvent): void {
      event.dataTransfer!.setData('text/plain', this.project.id);
      // eslint-disable-next-line no-param-reassign
      event.dataTransfer!.effectAllowed = 'move';
    }
    @autobind
    dragEndHandler(event: DragEvent): void {
      console.log(`DragEnd:${event}`);
    }
    configure() {
      this.element.addEventListener('dragstart', this.dragStartHandler);
      this.element.addEventListener('dragend', this.dragEndHandler);
    }
    renderContent() {
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = `${this.persons} assigned.`;
        this.element.querySelector('p')!.textContent = this.project.description;
    }
}

// Project List Class
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[];

    constructor(private type: 'active'|'finished') {
      super('project-list', 'app', false, `${type}-projects`);
      this.assignedProjects = [];

      this.configure();
      this.renderContent();
    }
    @autobind
    dragOverHandler(event: DragEvent): void {
      if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
        event.preventDefault();
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.add('droppable');
      }
    }
    @autobind
    dropHandler(event: DragEvent): void {
      const prjId = event.dataTransfer!.getData('text/plain');
      projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
    }

    @autobind
    dragLeaveHandler(_: DragEvent): void {
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.remove('droppable');
    }

    private renderProjects() {
      const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;
      listEl.innerHTML = '';
      for (const prjItem of this.assignedProjects) {
        new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
      }
    }

    configure() {
      this.element.addEventListener('dragover', this.dragOverHandler);
      this.element.addEventListener('dragleave', this.dragLeaveHandler);
      this.element.addEventListener('drop', this.dropHandler);
      projectState.addListener((projects: Project[]) => {
        const relevantProjects = projects.filter((prj) => {
          if (this.type === 'active') {
            return prj.status === ProjectStatus.Active;
          }
          return prj.status === ProjectStatus.Finished;
        });
        this.assignedProjects = relevantProjects;
        this.renderProjects();
      });
    }

    renderContent() {
      const listId = `${this.type}-project-list`;
      this.element.querySelector('ul')!.id = listId;
      this.element.querySelector('h2')!.textContent = `${this.type.toUpperCase()} PROJECTS`;
    }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
      super('project-input', 'app', true, 'user-input');

      this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement;
      this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement;
      this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement;

      this.configure();
    }

    // eslint-disable-next-line consistent-return
    private getherUserInput():[string, string, number] | void{
      const enteredTitle = this.titleInputElement.value;
      const enteredDescription = this.descriptionInputElement.value;
      const enteredPeople = this.peopleInputElement.value;

      const titleValidatable: Validatable = { value: enteredTitle, required: true };
      const descriptionValidatable: Validatable = { value: enteredDescription, minLength: 5 };
      const peopleValidatable: Validatable = { value: +enteredPeople, min: 1, max: 5 };

      if (!validate(titleValidatable)
            || !validate(descriptionValidatable)
            || !validate(peopleValidatable)) {
        alert('Invalide input, please try again!');
      } else {
        return [enteredTitle, enteredDescription, +enteredPeople];
      }
    }

    private clearInputs() {
      this.titleInputElement.value = '';
      this.descriptionInputElement.value = '';
      this.peopleInputElement.value = '';
    }

    @autobind
    private submitHandler(event: Event) {
      event.preventDefault();
      const userInput = this.getherUserInput();
      if (Array.isArray(userInput)) {
        const [title, desc, people] = userInput;
        projectState.addProject(title, desc, people);
        this.clearInputs();
      }
    }

    configure() {
      this.element.addEventListener('submit', this.submitHandler);
    }

    renderContent() {}
}

    new ProjectInput();
    new ProjectList('active');
    new ProjectList('finished');
}
