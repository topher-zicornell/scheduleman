import {ChangeEvent, Dispatch, SetStateAction} from 'react';

export default function YesNoComponent(props: { name: string,
    onChange: Dispatch<SetStateAction<string>> }) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.onChange(event.target.value);
  };
  return (
      <div>
        <label className="label cursor-pointer">
          <span className="labelText">Yes</span>
          <input name={props.name} value="true" onChange={handleChange}
                 type="radio" className="radio radio-primary"/>
        </label>
        <label className="label cursor-pointer">
          <span className="labelText">No</span>
          <input name={props.name} value="false"
                 type="radio" className="radio radio-primary" defaultChecked/>
        </label>
      </div>
  );
}
