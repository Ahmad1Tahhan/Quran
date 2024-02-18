<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class Auth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try{
        $token = JWTAuth::parseToken()->checkOrFail();
        if(!$token)
        return response()->json(['error' => 'Unauthorized'], 401);

        
        $request->userId = $token['sub'];
        // dd($request->userId);
        return $next($request);
        }
        catch(TokenInvalidException $e){
            return response()->json(["Error"=>"Invalid token."]);
        }
        catch(TokenExpiredException $e){
            return response()->json(["Error"=>"Token expired."]);
        }
        catch(Exception $e){
            return response()->json(["Unauthorized"=>"Invalid token",
                                     "Error"=>$e->getMessage()]);
        }
    }
}
