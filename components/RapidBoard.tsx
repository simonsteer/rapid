import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProps,
  DropResult,
} from 'react-beautiful-dnd'
import { useCallback, useState } from 'react'

type BoardData = { [key: string]: { id: string }[] }

export function RapidBoard({ initialData }: { initialData: BoardData }) {
  const [data, setData] = useState(initialData)

  const handleDragEnd = useCallback(
    ({ source, destination }: DropResult) => {
      if (!destination) return

      setData(data => {
        const current = [...data[source.droppableId]]
        const next = [...data[destination.droppableId]]
        const target = current[source.index]

        // moving to same list
        if (source.droppableId === destination.droppableId) {
          const reordered = [...current]
          const [removed] = reordered.splice(source.index, 1)
          reordered.splice(destination.index, 0, removed)

          return {
            ...data,
            [source.droppableId]: reordered,
          }
        }

        // moving to different list
        // remove from original
        current.splice(source.index, 1)
        // insert into next
        next.splice(destination.index, 0, target)

        return {
          ...data,
          [source.droppableId]: current,
          [destination.droppableId]: next,
        }
      })
    },
    [setData]
  )

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="w-screen h-screen flex items-start justify-center">
        {Object.keys(data).map(key => (
          <RapidBoardList
            id={key}
            key={key}
            items={data[key]}
            renderClone={(provided, snapshot, rubric) =>
              renderItem({
                ...provided,
                item: {
                  id: data[rubric.source.droppableId][rubric.source.index].id,
                },
              })
            }
          />
        ))}
      </div>
    </DragDropContext>
  )
}

function RapidBoardList<D extends { id: string }>({
  items,
  id,
  renderClone,
}: {
  items: D[]
  id: string
  renderClone: NonNullable<DroppableProps['renderClone']>
}) {
  return (
    <Droppable droppableId={id} renderClone={renderClone}>
      {provided => (
        <ul
          className="h-screen pt-2 overflow-y-scroll no-scrollbar"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {items.map((item, index) => (
            <Draggable draggableId={item.id} index={index} key={item.id}>
              {provided => renderItem({ ...provided, item })}
            </Draggable>
          ))}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  )
}

function renderItem<I extends { id: string }>({
  innerRef,
  draggableProps,
  dragHandleProps,
  item,
}: DraggableProvided & { item: I }) {
  return (
    <li
      className="w-48 h-48 break-word rounded-lg bg-white text-gray-800 shadow-md ml-4 mb-4 overflow-hidden"
      ref={innerRef}
      {...draggableProps}
    >
      <div className="p-2 rounded-sm bg-blue-50 border-b" {...dragHandleProps}>
        <p className="text-gray-700 truncate">{item.id}</p>
      </div>
    </li>
  )
}

export default RapidBoard
