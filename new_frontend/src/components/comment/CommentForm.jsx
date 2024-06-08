import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CommentForm = ( {handleSubmit, submitLabel} ) => {
    
    const [text, setText] = useState("");
    const isTextareaDisabled = text.length === 0;

    const onSubmit = (event) => {
    event.preventDefault();
    if (text.trim()) { 
        handleSubmit(text.trim());
        setText("");
    }
    };

    return (
    <form onSubmit={onSubmit} aria-label="Comment form">
        <textarea
        className="w-full h-20 mb-2 border-2 border-black-500 text-black p-4" 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="รีวิวหนังสือเล่มนี้ . . ."
        aria-required="true"
        aria-label="Comment text"
        />
        <button
        className="text-base px-4 py-2 bg-green-400 rounded-lg text-black hover:bg-green-700  cursor-pointer anihover" 
        disabled={isTextareaDisabled}
        type='submit'
        >
        {submitLabel}
        </button>
    </form>
    );
    };

export default CommentForm;
