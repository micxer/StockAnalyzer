package ch.steve84.stock_analyzer.repository.quandl;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import ch.steve84.stock_analyzer.entity.quandl.User;

@RepositoryRestResource(collectionResourceRel = "user", path = "user")
public interface UserRepository extends CrudRepository<User, Integer> {
	User findByUsername(@Param("username") String username);
	boolean existsByUsername(@Param("username") String username);
	User register(User user);
	boolean confirm(Integer userId, String hash, String password);
	boolean resetPassword(String username);
	boolean changePassword(Integer userId, String oldPassword, String newPassword);
	boolean validateCaptcha(String token);
	User updateUser(User user);
	User getUser(Integer userId);
	boolean remove(Integer userId, String password);
	boolean addCard(Integer userId, String token);
}
