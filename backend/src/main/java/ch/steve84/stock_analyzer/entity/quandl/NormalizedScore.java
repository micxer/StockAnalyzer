package ch.steve84.stock_analyzer.entity.quandl;

import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@NamedQueries({
@NamedQuery(name = "NormalizedScore.findById", query = "select ns from NormalizedScore ns where ns.scoreId = :id"),
@NamedQuery(name = "NormalizedScore.findByIdPublic", query = "select ns from NormalizedScore ns where ns.scoreId = :id and (ns.stock.publicStock = TRUE or ns.index.publicIndex = TRUE)"),
@NamedQuery(name = "NormalizedScore.findAllNormalizedScores", query = "select ns from NormalizedScore ns"),
@NamedQuery(name = "NormalizedScore.countAllNormalizedScores", query = "select count(ns) from NormalizedScore ns"),
@NamedQuery(name = "NormalizedScore.findAllPublicNormalizedScores", query = "select ns from NormalizedScore ns where ns.stock.publicStock = TRUE or ns.index.publicIndex = TRUE"),
@NamedQuery(name = "NormalizedScore.countAllPublicNormalizedScores", query = "select count(ns) from NormalizedScore ns where ns.stock.publicStock = TRUE or ns.index.publicIndex = TRUE")
})
@Table(name = "vscore_normalized")
public class NormalizedScore {
	@Id
    @Column(name = "score_id")
    private Integer scoreId;
    
    @ManyToOne
    @JoinColumn(name = "score_type_id")
    private ScoreType scoreType;
    
    @ManyToOne
    @JoinColumn(name = "stock_id")
    private Stock stock;
    
    @ManyToOne
    @JoinColumn(name = "index_id")
    private Index index;
    
    @Column(name = "score_value")
    private Double scoreValue;
    @Column(name = "modified_at")
    private Calendar modifiedAt;

    public NormalizedScore() {}

	public NormalizedScore(Integer scoreId, Stock stock, Double scoreValue) {
		this.scoreId = scoreId;
        this.stock = stock;
        this.scoreValue = scoreValue;
    }

    public NormalizedScore(Integer scoreId, Index index, Double scoreValue) {
    	this.scoreId = scoreId;
        this.index = index;
        this.scoreValue = scoreValue;
    }

    public ScoreType getScoreType() {
		return scoreType;
	}

	public void setScoreType(ScoreType scoreType) {
		this.scoreType = scoreType;
	}

	public Stock getStock() {
		return stock;
	}

	public void setStock(Stock stock) {
		this.stock = stock;
	}

	public Index getIndex() {
		return index;
	}

	public void setIndex(Index index) {
		this.index = index;
	}

	public Double getScoreValue() {
		return scoreValue;
	}

	public void setScoreValue(Double scoreValue) {
		this.scoreValue = scoreValue;
	}

	public Calendar getModifiedAt() {
		return modifiedAt;
	}

	public void setModifiedAt(Calendar modifiedAt) {
		this.modifiedAt = modifiedAt;
	}

	public Integer getScoreId() {
		return scoreId;
	}
}
