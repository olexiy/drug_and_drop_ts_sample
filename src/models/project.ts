/* eslint-disable no-useless-constructor */
// Project status enumeration
export enum ProjectStatus{
    Active, Finished
}
// Project Type
export class Project {
  constructor(public id: string,
                public title: string,
                public description: string,
                public people: number,
                public status: ProjectStatus) {}
}
