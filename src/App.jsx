import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addEmployee,
  deleteEmployee,
  fetchEmployees,
  updateEmployee,
} from './redux/employeeSlice'
import './App.css'

const emptyForm = { name: '', email: '', department: 'IT', salary: '' }

function App() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.employees)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('All')

  useEffect(() => {
    dispatch(fetchEmployees())
  }, [dispatch])

  const departments = useMemo(
    () => ['All', ...new Set(items.map((employee) => employee.department))],
    [items],
  )

  const filteredEmployees = useMemo(() => {
    const query = search.toLowerCase().trim()
    return items.filter((employee) => {
      const matchesSearch =
        !query ||
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query)
      const matchesDepartment =
        department === 'All' || employee.department === department
      return matchesSearch && matchesDepartment
    })
  }, [items, search, department])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name || !form.email || !form.salary) return

    if (editingId) {
      await dispatch(updateEmployee({ id: editingId, employee: form }))
    } else {
      await dispatch(addEmployee(form))
    }

    setForm(emptyForm)
    setEditingId(null)
  }

  const handleEdit = (employee) => {
    setEditingId(employee.id)
    setForm({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      salary: employee.salary,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    await dispatch(deleteEmployee(id))
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <span className="badge">Redux Toolkit • Full Stack</span>
          <h1>ManageHub</h1>
          <p>Employee Management System</p>
        </div>
        <div className="hero-stat">
          <strong>{items.length}</strong>
          <span>Employees</span>
        </div>
      </header>

      <main className="dashboard">
        <section className="card form-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{editingId ? 'Edit employee' : 'New employee'}</span>
              <h2>{editingId ? 'Update employee' : 'Add employee'}</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="employee-form">
            <input
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            >
              <option>IT</option>
              <option>HR</option>
              <option>Finance</option>
              <option>Sales</option>
              <option>Marketing</option>
            </select>
            <input
              type="number"
              min="0"
              placeholder="Salary"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
              required
            />
            <div className="form-actions">
              <button className="primary-btn" type="submit">
                {editingId ? 'Update Employee' : 'Add Employee'}
              </button>
              {editingId && (
                <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => {
                    setEditingId(null)
                    setForm(emptyForm)
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card table-card">
          <div className="toolbar">
            <div>
              <span className="eyebrow">Employee directory</span>
              <h2>Manage employees</h2>
            </div>
            <div className="filters">
              <input
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                {departments.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          {status === 'loading' && <p className="state-message">Loading employees...</p>}
          {error && <p className="error-message">{error}</p>}

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td><strong>{employee.name}</strong></td>
                    <td>{employee.email}</td>
                    <td><span className="department-pill">{employee.department}</span></td>
                    <td>₹{Number(employee.salary).toLocaleString('en-IN')}</td>
                    <td>
                      <div className="row-actions">
                        <button className="edit-btn" onClick={() => handleEdit(employee)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(employee.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {status !== 'loading' && filteredEmployees.length === 0 && (
              <p className="state-message">No employees found.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
