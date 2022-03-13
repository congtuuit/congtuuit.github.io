import { Input } from "antd"

export default function InputCustom({ setUsername }) {

    const onChangeInput = (e) => {
        setUsername(e.target.value)
    }

    const onClickToChange = () => {
        const data = "Hello world";
        setUsername(data);
    }

    return (
        <>
            <Input onChange={onChangeInput} placeholder="on change data and response to parent"></Input>
            <button onClick={onClickToChange}>Click to change</button>
        </>

    )
}