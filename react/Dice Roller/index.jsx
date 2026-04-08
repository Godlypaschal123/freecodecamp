const App = () => {
    const [count, setCount] = React.useState(0);

    return (
        <div className="app-container">
            <h1>Dice Roller</h1>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));