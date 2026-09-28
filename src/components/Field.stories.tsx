import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "./Field";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b68fa]";

const meta = {
  title: "Components/Field",
  component: Field,
  args: { orientation: "vertical" },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["vertical", "horizontal", "responsive"],
    },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: (args) => (
    <Field {...args}>
      <FieldLabel htmlFor="name">Ім'я</FieldLabel>
      <input id="name" className={inputClass} placeholder="Karyna" />
      <FieldDescription>Так ти підпишеш свою роботу.</FieldDescription>
    </Field>
  ),
};

export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <Field {...args}>
      <FieldContent>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <FieldDescription>Ми напишемо лише по справі.</FieldDescription>
      </FieldContent>
      <input id="email" className={`${inputClass} max-w-56`} placeholder="you@example.com" />
    </Field>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <Field {...args}>
      <FieldLabel htmlFor="password">Пароль</FieldLabel>
      <input id="password" type="password" className={inputClass} aria-invalid />
      <FieldError>Пароль має містити щонайменше 8 символів.</FieldError>
    </Field>
  ),
};

export const Group: Story = {
  render: () => (
    <FieldGroup className="max-w-sm">
      <FieldSet>
        <FieldLegend>Контакти</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="group-name">Ім'я</FieldLabel>
            <input id="group-name" className={inputClass} placeholder="Karyna" />
          </Field>
          <Field>
            <FieldLabel htmlFor="group-email">Email</FieldLabel>
            <input id="group-email" className={inputClass} placeholder="you@example.com" />
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSeparator>або</FieldSeparator>
      <Field>
        <FieldLabel htmlFor="group-link">Посилання на портфоліо</FieldLabel>
        <input id="group-link" className={inputClass} placeholder="https://..." />
      </Field>
    </FieldGroup>
  ),
};
