import type { Meta, StoryObj } from "@storybook/react-vite";
import { Notification } from "./Notification";
import type { NotificationProps, NotificationType } from "./Notification";

const meta = {
  title: "Components/Notification",
  component: Notification,
  args: {
    title: "Ваш текст",
    description: "Вставте опис сповіщення тут. Було б краще, якби це було на двох рядках.",
    type: "info",
    size: "sm",
    primaryAction: { label: "Кнопка" },
    secondaryAction: { label: "Кнопка" },
    onDismiss: () => {},
  },
  argTypes: {
    type: { control: "inline-radio", options: ["info", "success", "warning", "error"] },
    size: { control: "inline-radio", options: ["xs", "sm"] },
  },
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

const types: NotificationType[] = ["info", "success", "warning", "error"];

function stack(props: Partial<NotificationProps>) {
  return (
    <div className="flex flex-col gap-4">
      {types.map((type) => (
        <Notification key={type} {...(meta.args as NotificationProps)} {...props} type={type} />
      ))}
    </div>
  );
}

export const Playground: Story = {};

export const Detailed: Story = {
  render: () => stack({ size: "sm" }),
};

export const Compact: Story = {
  render: () => stack({ size: "xs" }),
};

export const WithoutIconOrDismiss: Story = {
  args: { showIcon: false, onDismiss: undefined, secondaryAction: undefined },
};
