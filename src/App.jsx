import { useEffect, useState, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
function App() {
  const [payments, setPayments] = useState(
    JSON.parse(localStorage.getItem("payments")) || [
      { type: "other", money: 2830, description: "Initial Money" },
      { type: "invest", profit: -175, invested: 535, name: "Semines" },
      { type: "invest", profit: 722, invested: 550, name: "Candian Solari" },
      { type: "invest", profit: 800, invested: 1600, name: "Candian Solari" },
      { type: "invest", profit: -210, invested: 480, name: "Anc Mining" },
      { type: "invest", profit: -2096, invested: 2400, name: "Splyt" },
      { type: "other", money: 2000, description: "money added" },
    ]
  );
  const [selected, setSelected] = useState(0);
  const [add, setAdd] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (selected != -1) inputRef.current?.focus();
  }, [selected]);
  useEffect(() => {
    setTotal(() => {
      let t = 0;
      payments
        .filter((p) => p.type == "invest")
        .forEach((p) => (t += p.profit));
      payments.filter((p) => p.type == "other").forEach((p) => (t += p.money));
      return t;
    });
    localStorage.setItem("payments", JSON.stringify(payments));
  }, [payments]);

  const [total, setTotal] = useState(0);
  return (
    <div className="payments">
      {payments.map((payment, p_index) => {
        if (payment.type == "invest") {
          return (
            <div className="payment" key={p_index}>
              <p className={"profit " + (payment.profit < 0 ? "neg" : "pos")}>
                {payment.profit}
              </p>
              <p className="invested">{payment.invested}</p>
              <FiPlus
                className="add-btn"
                onClick={(e) => {
                  if (selected != p_index) {
                    setSelected(p_index);
                    // setTimeout(() => {
                    //   const temp =
                    //     document.querySelectorAll(".payment")[p_index];
                    //   temp.querySelector(".input").focus();
                    // }, 1000);
                  } else {
                    if (!add) {
                      setSelected(-1);
                    } else {
                      payments[p_index].profit += +add;
                      setPayments([...payments]);
                      setAdd("");
                    }
                  }
                }}
              />
              {selected == p_index ? (
                <form
                  action=""
                  onSubmit={(e) => {
                    e.preventDefault();
                    payments[p_index].profit += +add;
                    setPayments([...payments]);
                    setSelected(-1);
                    setAdd("");
                  }}
                >
                  <input
                    type="text"
                    value={add}
                    ref={inputRef}
                    onChange={(e) => setAdd(e.target.value)}
                    name="add"
                  />
                </form>
              ) : (
                <p className="description">{payment.name}</p>
              )}
            </div>
          );
        } else if (payment.type == "other") {
          return (
            <div className="other payment" key={p_index}>
              <p className="money">{payment.money}</p>
              <p className="description">{payment.description}</p>
            </div>
          );
        }
      })}

      <p className="total">
        Total:
        <span className="total-value">{total}</span>
      </p>
    </div>
  );
}

export default App;
