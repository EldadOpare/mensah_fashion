import { createContext, useContext, useReducer, useCallback } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.item_id === action.item.item_id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.item_id === action.item.item_id ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1, item_note: '' }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.item_id !== action.item_id) }
    case 'UPDATE_QTY':
      if (action.qty < 1) {
        return { ...state, items: state.items.filter(i => i.item_id !== action.item_id) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.item_id === action.item_id ? { ...i, qty: action.qty } : i
        ),
      }
    case 'UPDATE_NOTE':
      return {
        ...state,
        items: state.items.map(i =>
          i.item_id === action.item_id ? { ...i, item_note: action.note } : i
        ),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const addItem = useCallback((item) => dispatch({ type: 'ADD_ITEM', item }), [])
  const removeItem = useCallback((item_id) => dispatch({ type: 'REMOVE_ITEM', item_id }), [])
  const updateQty = useCallback((item_id, qty) => dispatch({ type: 'UPDATE_QTY', item_id, qty }), [])
  const updateNote = useCallback((item_id, note) => dispatch({ type: 'UPDATE_NOTE', item_id, note }), [])
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0)
  const totalMinor = state.items.reduce((sum, i) => sum + i.price_minor * i.qty, 0)

  return (
    <CartContext.Provider value={{ items: state.items, addItem, removeItem, updateQty, updateNote, clearCart, totalItems, totalMinor }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
