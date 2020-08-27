/* eslint-disable import/prefer-default-export */
namespace App{
    export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
}
