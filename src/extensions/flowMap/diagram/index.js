/*
 * @Author: ykx
 * @Date: 2022-11-23 11:03:56
 * @LastEditTime: 2022-12-21 10:57:04
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \we-knowledge-base\src\tiptap\core\extensions\flowMap\diagram\index.js
 */
import './diagram.less'

export function createEditor(div) {
  if (!div) {
    throw new Error('Must pass a container to render editor')
  }
  const editorUi = new window.EditorUi(new window.Editor(false), div)
  console.log(window.ExportDialog);
  const setXml = xml => {
    const xmlDoc = window.mxUtils.parseXml(xml)
    const codec = new window.mxCodec(xmlDoc)

    editorUi.editor.graph.model.beginUpdate()

    try {
      editorUi.editor.graph.model.clear()
      editorUi.editor.updateGraphComponents()
      codec.decode(xmlDoc.documentElement, editorUi.editor.graph.getModel())
    } finally {
      editorUi.editor.graph.model.endUpdate()
    }

    editorUi.editor.fireEvent(new window.mxEventObject('resetGraphView'))
  }

  const getXml = () => {
    return window.mxUtils.getXml(editorUi.editor.getGraphXml())
  }

  editorUi.setXml = setXml
  editorUi.getXml = getXml

  return editorUi
}

export function renderXml(div, xml) {
  const graph = new window.Graph(div)
  graph.resizeContainer = true
  graph.setEnabled(false)

  const setXml = xml => {
    const xmlDoc = window.mxUtils.parseXml(xml)
    const codec = new window.mxCodec(xmlDoc)
    codec.decode(xmlDoc.documentElement, graph.getModel())
  }

  setXml(xml)

  graph.setXml = setXml

  return graph
}

export function load() {
  if (typeof window !== 'undefined' && window.mxClient && window.EditorUi) {
    return Promise.resolve()
  } else {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.onload = resolve
      script.onerror = reject
      script.src = '/diagram/diagram.min.js'
      document.head.appendChild(script)
    })
  }
}
