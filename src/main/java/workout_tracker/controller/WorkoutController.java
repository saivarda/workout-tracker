package workout_tracker.controller;

import org.springframework.web.bind.annotation.*;
import workout_tracker.model.*;
import workout_tracker.service.WorkoutService;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class WorkoutController {

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @GetMapping("/exercises")
    public List<Exercise> getExercises(@RequestParam(required = false) String muscleGroup) {
        if (muscleGroup != null) return workoutService.getExercisesByMuscleGroup(muscleGroup);
        return workoutService.getAllExercises();
    }

    @PostMapping("/exercises")
    public Exercise createExercise(@RequestBody Exercise exercise) {
        return workoutService.createExercise(exercise);
    }

    @GetMapping("/sessions")
    public List<WorkoutSession> getSessions() {
        return workoutService.getAllSessions();
    }

    @GetMapping("/sessions/{id}")
    public WorkoutSession getSession(@PathVariable Long id) {
        return workoutService.getSessionById(id);
    }

    @PostMapping("/sessions")
    public WorkoutSession createSession(@RequestBody WorkoutSession session) {
        return workoutService.createSession(session);
    }

    @DeleteMapping("/sessions/{id}")
    public void deleteSession(@PathVariable Long id) {
        workoutService.deleteSession(id);
    }

    @PostMapping("/sessions/{sessionId}/sets")
    public WorkoutSet addSet(@PathVariable Long sessionId,
                             @RequestParam Long exerciseId,
                             @RequestBody WorkoutSet set) {
        return workoutService.addSetToSession(sessionId, exerciseId, set);
    }

    @GetMapping("/sessions/{sessionId}/sets")
    public List<WorkoutSet> getSetsForSession(@PathVariable Long sessionId) {
        return workoutService.getSetsForSession(sessionId);
    }

    @GetMapping("/exercises/{exerciseId}/prs")
    public List<WorkoutSet> getPersonalBests(@PathVariable Long exerciseId) {
        return workoutService.getPersonalBests(exerciseId);
    }
}
