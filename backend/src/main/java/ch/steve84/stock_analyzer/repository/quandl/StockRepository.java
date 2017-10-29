package ch.steve84.stock_analyzer.repository.quandl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import ch.steve84.stock_analyzer.entity.quandl.Branch;
import ch.steve84.stock_analyzer.entity.quandl.Country;
import ch.steve84.stock_analyzer.entity.quandl.Stock;

@RepositoryRestResource(collectionResourceRel = "stock", path = "stocks")
public interface StockRepository extends ReadOnlyRepository<Stock, Integer> {
	@PreAuthorize("hasAuthority('GPU')")
	@Query("select s from Stock s left join s.scores sc left join sc.scoreType t where (sc is null or t.name = :name) and s.publicStock = TRUE")
	Page<Stock> findByScoreTypeGPU(@Param("name") String name, Pageable pageable);

	@PreAuthorize("hasAnyAuthority('Admin', 'Abo')")
	@Query("select s from Stock s left join s.scores sc left join sc.scoreType t where sc is null or t.name = :name")
	Page<Stock> findByScoreType(@Param("name") String name, Pageable pageable);
	
	@PreAuthorize("hasAuthority('GPU')")
	@Query("select s from Stock s where (upper(s.name) like concat('%', upper(:name), '%') or upper(s.isin) like concat('%', upper(:isin), '%')) and s.publicStock = TRUE")
	List<Stock> findByIsinOrNameGPU(@Param("isin") String isin, @Param("name") String name, Pageable pageable);
	
	@PreAuthorize("hasAnyAuthority('Admin', 'Abo')")
	@Query("select s from Stock s where upper(s.name) like concat('%', upper(:name), '%') or upper(s.isin) like concat('%', upper(:isin), '%')")
	List<Stock> findByIsinOrName(@Param("isin") String isin, @Param("name") String name, Pageable pageable);

	@Query("select distinct s.country from Stock s")
	List<Country> getAllCountries();
	@Query("select distinct s.branch from Stock s")
	List<Branch> getAllBranches();
	
	@Query("select distinct s from Stock s "
			+ "left join s.indices i where"
			+ "(upper(s.name) like %:name% or :name is null) and "
			+ "(upper(s.isin) like %:isin% or :isin is null) and "
			+ "(upper(s.nsin) like %:nsin% or :nsin is null) and "
			+ "(upper(s.wkn) like %:wkn% or :wkn is null) and "
			+ "(s.country.countryId in :countryIds or :countryIds is null) and "
			+ "(s.branch.branchId in :branchIds or :branchIds is null) and "
			+ "(i.indexId in :indexIds or :indexIds is null)")
	Page<Stock> searchStocks(@Param("name") String name,
							 @Param("isin") String isin,
							 @Param("nsin") String nsin,
							 @Param("wkn") String wkn,
							 @Param("countryIds") List<Integer> countryIds,
							 @Param("branchIds") List<Integer> branchIds,
							 @Param("indexIds") List<Integer> indexIds,
							 Pageable pageable);

	@Query("select distinct s from Stock s "
			+ "left join s.indices i where"
			+ "(upper(s.name) like %:name% or :name is null) and "
			+ "(upper(s.isin) like %:isin% or :isin is null) and "
			+ "(upper(s.nsin) like %:nsin% or :nsin is null) and "
			+ "(upper(s.wkn) like %:wkn% or :wkn is null) and "
			+ "(s.country.countryId in :countryIds or :countryIds is null) and "
			+ "(s.branch.branchId in :branchIds or :branchIds is null) and "
			+ "(i.indexId in :indexIds or :indexIds is null) and "
			+ "s.publicStock = TRUE")
	Page<Stock> searchStocksGPU(@Param("name") String name,
							 @Param("isin") String isin,
							 @Param("nsin") String nsin,
							 @Param("wkn") String wkn,
							 @Param("countryIds") List<Integer> countryIds,
							 @Param("branchIds") List<Integer> branchIds,
							 @Param("indexIds") List<Integer> indexIds,
							 Pageable pageable);
}
