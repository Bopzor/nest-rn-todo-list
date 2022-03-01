type TodoAttributes = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  checked: boolean;
};

export class Todo {
  readonly id: string;
  readonly user_id: string;
  readonly title: string;
  readonly description?: string;
  readonly checked: boolean;

  constructor(attributes: TodoAttributes) {
    this.id = attributes.id;
    this.user_id = attributes.user_id;
    this.title = attributes.title;
    this.description = attributes.description;
    this.checked = attributes.checked;
  }
}
