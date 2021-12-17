type RoundedButtonProps = {
  size?: 'large' | 'normal'
}

export function RoundedButton({
  style,
  size = 'normal',
  ...rest
}: React.ComponentProps<'button'> & RoundedButtonProps) {
  const sizeStyle = {
    large: {
      fontSize: 30,
    },
    normal: {
      fontSize: 14,
    },
  }[size]

  return (
    <button
      style={{
        ...style,
        borderRadius: 200,
        ...sizeStyle,
      }}
      {...rest}
    />
  )
}

type ButtonOwnProps<E extends React.ElementType> = {
  as?: E
  children: React.ReactNode
}

type ButtonProps<E extends React.ElementType> = ButtonOwnProps<E> &
  Omit<React.ComponentProps<E>, keyof ButtonOwnProps<E>>

export function Button<E extends React.ElementType = 'button'>({
  as,
  children,
  style,
  ...rest
}: ButtonProps<E>) {
  const Component = as ?? 'button'

  return (
    <Component
      className="Button"
      style={{
        border: 'none',
        padding: '10px 20px',
        backgroundColor: 'mediumslateblue',
        color: 'white',
        cursor: 'pointer',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Component>
  )
}
