import PatientForm from './PatientForm'

const CIRC = ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','⑪','⑫','⑬','⑭','⑮','⑯','⑰','⑱','⑲','⑳','㉑','㉒','㉓','㉔','㉕','㉖','㉗','㉘','㉙','㉚','㉛','㉜','㉝','㉞','㉟','㊱','㊲','㊳','㊴','㊵','㊶','㊷','㊸','㊹','㊺','㊻','㊼','㊽','㊾','㊿']
function toC(n) { return n >= 1 && n <= 50 ? CIRC[n-1] : '('+n+')' }

export default function PatientModal({ patient, doctors, onClose, onUpdate, onUpdatePhase, onOpenCal, onDelete }) {
  const p = patient

  function bgClick(e) { if (e.target.id === 'modal-bg') onClose() }

  return (
    <div className="modal-bg" id="modal-bg" onClick={bgClick}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-hd">
          <div>
            <div style={{fontSize:'13px',fontWeight:600,color:'#111'}}>{p.name}</div>
            <div style={{fontSize:'10px',color:'#999',marginTop:'2px'}}>
              カルテ番号 {p.chart} · {p.type==='pedo'?'小児矯正':'成人矯正'} · {p.phases?.[0]?.cyc==='5'?'5日交換':'1週間交換'}
              {p.type==='pedo'&&p.doc?' · 担当：'+p.doc:''}
            </div>
          </div>
          <div style={{display:'flex',gap:'5px',alignItems:'center'}}>
            <button className="btn-sm btn-sm-green" onClick={() => onOpenCal(p)}>カレンダー</button>
            <button className="m-close" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="modal-body">
          <PatientForm
            initial={p}
            doctors={doctors}
            onSubmit={async (updated) => { await onUpdate(updated); onClose() }}
            onCancel={onClose}
          />
          {p.phases?.length > 1 && (
            <div style={{marginTop:'16px',paddingTop:'12px',borderTop:'1px solid #eee'}}>
              {p.phases.slice(1).map((ph2, i) => {
                const pi = i + 1
                const iprTxt = ph2.ipr_stages?.length ? ph2.ipr_stages.map(toC).join('・') : 'なし'
                return (
                  <div key={pi}>
                    <div style={{fontSize:'10px',fontWeight:600,color:'#999',marginBottom:'6px'}}>
                      {pi+1}回目（追加アライナー）
                      <button className="btn-sm" style={{marginLeft:'8px',fontSize:'10px'}} onClick={() => onOpenCal(p)}>カレンダーで編集</button>
                    </div>
                    <div className="d-grid">
                      <div className="d-field"><div className="d-lbl">総枚数</div><div className="d-val">{ph2.total}枚</div></div>
                      <div className="d-field"><div className="d-lbl">現在</div><div className="d-val">{ph2.cur}枚目</div></div>
                      <div className="d-field"><div className="d-lbl">開始日</div><div className="d-val">{ph2.start}</div></div>
                      <div className="d-field"><div className="d-lbl">サイクル</div><div className="d-val">{ph2.cyc==='5'?'5日':'7日'}</div></div>
                      <div className="d-field" style={{gridColumn:'1/-1'}}><div className="d-lbl">IPRステージ</div><div className="d-val">{iprTxt}</div></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <div style={{marginTop:'16px',paddingTop:'12px',borderTop:'1px solid #eee'}}>
            <button
              className="btn"
              style={{fontSize:'12px',color:'#dc2626',borderColor:'#fca5a5',background:'#fff'}}
              onClick={() => {
                if (confirm(p.name + 'を削除しますか？この操作は取り消せません。')) {
                  onDelete(p.id)
                }
              }}
            >この患者を削除する</button>
          </div>
        </div>
      </div>
    </div>
  )
}
