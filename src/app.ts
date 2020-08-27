/* eslint-disable no-restricted-syntax */
/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */
/// <reference path="models/drag-and-drop.ts"/>
/// <reference path="models/project.ts"/>
/// <reference path="state/project-state.ts"/>
/// <reference path="decorators/autobind.ts"/>
/// <reference path="util/validation.ts"/>
/// <reference path="components/base-component.ts"/>
/// <reference path="components/project-input.ts"/>
/// <reference path="components/project-item.ts"/>
/// <reference path="components/project-list.ts"/>

namespace App{
    new ProjectInput();
    new ProjectList('active');
    new ProjectList('finished');
}
