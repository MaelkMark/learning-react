import classNames from "classnames"

export default function Die(props) {
  const classes = classNames(
    "die",
    {
      "held": props.held
    }
  )

  return (
    <button onClick={props.hold} className={classes}>
      {props.value}
    </button>
  )
}