<td>
  <div className="expense-actions">

    <Link
      to={`/expenses/edit/${expense.id}`}
      className="edit-button"
    >
      Edit
    </Link>

    <button
      type="button"
      className="delete-button"
      onClick={() => handleDelete(expense.id)}
    >
      Delete
    </button>

  </div>
</td>