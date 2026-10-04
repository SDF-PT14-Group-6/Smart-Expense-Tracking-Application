import './App.css'
import Transactions from "./components/Transactions";

export default function App() {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-content">
          <h1>SmartExpense</h1>
          <p>
            Track your income, manage your expenses, and understand where your
            money goes.
          </p>

          <div className="hero-actions">
            <button type="button">Login</button>
            <button type="button">Create Account</button>
          </div>
        </div>
      </section>
      {/* <Transactions /> */}
    </main>
  )
}

