import LoginForm from "../components/LoginForm/LoginForm";

const Login =() =>{
  return(
    <>
      <div className="flex flex-row flex-grow justify-around md:flex-row p-5">
        <LoginForm />
      </div>
    </>
  )
}

export default Login;