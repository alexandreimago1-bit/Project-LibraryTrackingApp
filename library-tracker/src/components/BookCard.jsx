function BookCard(props){
    return(
        <div>
            <h1>{props.book.title}</h1>
            <h2>{props.book.author}</h2>
            <h3>{props.book.genre}</h3>
            <h4>{props.book.status}</h4>
            <button onClick={props.onRemove}>Remove</button>
            <button onClick={props.book.status == 'tbr' ? props.onStartReading: props.book.status == 'reading' ? props.onFinishReading: props.book.status == 'finished' ? props.onStartReading: null }>{props.book.status == 'tbr' ? 'Start Reading': props.book.status == 'reading' ? 'Finish': 'Read Again'}</button>
        </div>

       
    
    );
}
export default BookCard