import React from 'react';

function CaseRequestForm() {
  return (
    <form>
      <div>
        <label htmlFor="caseName">Case Name:</label>
        <input type="text" id="caseName" name="caseName" />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea id="description" name="description"></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default CaseRequestForm;
