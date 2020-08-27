// Project Item Class
import { Draggable } from '../models/drag-and-drop.js';
import { Project } from '../models/project.js';
import { Component } from '../components/base-component.js';
import { autobind } from '../decorators/autobind.js';

export class ProjectItem extends Component<HTMLUListElement, HTMLElement> implements Draggable {
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
