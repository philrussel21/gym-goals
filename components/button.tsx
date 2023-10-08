type BaseButtonProperties = {
  label: string;
};

type ButtonProperties = BaseButtonProperties &
  React.ComponentPropsWithoutRef<'button'>;

const baseButtonClasses = 'bg-gray-800 text-white rounded-md py-2 px-4';

const Button = ({
  label,
  className,
  ...intrinsicButtonProperties
}: ButtonProperties): JSX.Element => (
  <button
    className={`${baseButtonClasses} ${className ?? ''}`}
    {...intrinsicButtonProperties}
  >
    {label}
  </button>
);

export default Button;

export type {ButtonProperties as ButtonProps};
