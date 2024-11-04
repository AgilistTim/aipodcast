import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]: Caught error:', error);
    console.error('[ErrorBoundary]: Error info:', errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              The application encountered an unexpected error. You can try reloading the page.
            </p>
            <button
              onClick={this.handleReload}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors mb-6"
            >
              Reload Page
            </button>
            {this.state.error && (
              <div className="mt-4">
                <p className="font-semibold text-gray-700 mb-2">Error Details:</p>
                <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-[200px] text-sm">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;